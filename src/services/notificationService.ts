import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();
const EXPO_PUSH_API = 'https://exp.host/--/api/v2/push/send';
const MAX_RETRIES = 3;
const BACKOFF_FACTOR = 2; // seconds

/**
 * Register a device for push notifications
 */
export async function registerDevice(userId: string, expoToken: string, platform: string) {
  try {
    // Check if the device token already exists
    const existingDevice = await prisma.device.findUnique({
      where: { expoToken }
    });
    
    if (existingDevice) {
      // If the device exists but belongs to a different user, update the userId
      if (existingDevice.userId !== userId) {
        const updatedDevice = await prisma.device.update({
          where: { id: existingDevice.id },
          data: { 
            userId,
            platform
          }
        });
        console.log(`Updated device token ${expoToken} to user ${userId}`);
        return { 
          success: true, 
          message: "Device token updated", 
          deviceId: updatedDevice.id 
        };
      }
      // Device already registered to this user, just update last used timestamp
      await prisma.device.update({
        where: { id: existingDevice.id },
        data: { lastUsed: new Date() }
      });
      return { 
        success: true, 
        message: "Device already registered", 
        deviceId: existingDevice.id 
      };
    }
    
    // Create a new device
    const newDevice = await prisma.device.create({
      data: {
        userId,
        expoToken,
        platform
      }
    });
    
    console.log(`Registered new device token for user ${userId}`);
    return { 
      success: true, 
      message: "Device registered successfully", 
      deviceId: newDevice.id 
    };
  } catch (error) {
    console.error(`Error registering device: ${error}`);
    return { 
      success: false, 
      message: `Failed to register device: ${error instanceof Error ? error.message : String(error)}` 
    };
  }
}

/**
 * Update an existing device token
 */
export async function updateDeviceToken(oldToken: string, newToken: string, platform: string) {
  try {
    const device = await prisma.device.findUnique({
      where: { expoToken: oldToken }
    });
    
    if (!device) {
      console.warn(`Device with token ${oldToken} not found`);
      return { 
        success: false, 
        message: "Device not found" 
      };
    }
    
    const updatedDevice = await prisma.device.update({
      where: { id: device.id },
      data: {
        expoToken: newToken,
        platform,
        lastUsed: new Date()
      }
    });
    
    console.log(`Updated device token from ${oldToken} to ${newToken}`);
    return { 
      success: true, 
      message: "Device token updated successfully" 
    };
  } catch (error) {
    console.error(`Error updating device token: ${error}`);
    return { 
      success: false, 
      message: `Failed to update device token: ${error instanceof Error ? error.message : String(error)}` 
    };
  }
}

/**
 * Remove a device from the database
 */
export async function removeDevice(expoToken: string) {
  try {
    const device = await prisma.device.findUnique({
      where: { expoToken }
    });
    
    if (!device) {
      console.warn(`Device with token ${expoToken} not found for removal`);
      return { 
        success: false, 
        message: "Device not found" 
      };
    }
    
    await prisma.device.delete({
      where: { id: device.id }
    });
    
    console.log(`Removed device token ${expoToken}`);
    return { 
      success: true, 
      message: "Device removed successfully" 
    };
  } catch (error) {
    console.error(`Error removing device: ${error}`);
    return { 
      success: false, 
      message: `Failed to remove device: ${error instanceof Error ? error.message : String(error)}` 
    };
  }
}

/**
 * Send a notification to all devices of a specific user
 */
export async function sendNotificationToUser(userId: string, title: string, body: string, data: any = {}) {
  try {
    const devices = await prisma.device.findMany({
      where: { userId }
    });
    
    if (!devices || devices.length === 0) {
      console.warn(`No devices found for user ${userId}`);
      return { 
        success: false, 
        message: "No devices registered for this user" 
      };
    }
    
    const results = [];
    for (const device of devices) {
      const result = await sendPushNotification(
        device.expoToken, 
        title, 
        body, 
        data
      );
      results.push({ deviceId: device.id, result });
    }
    
    return { 
      success: true, 
      message: "Notifications sent", 
      results 
    };
  } catch (error) {
    console.error(`Error sending notification to user: ${error}`);
    return { 
      success: false, 
      message: `Failed to send notifications: ${error instanceof Error ? error.message : String(error)}` 
    };
  }
}

/**
 * Send a notification to all registered devices
 */
export async function sendNotificationToAll(title: string, body: string, data: any = {}) {
  try {
    const devices = await prisma.device.findMany();
    
    if (!devices || devices.length === 0) {
      console.warn('No devices found in the database');
      return { 
        success: false, 
        message: "No devices registered" 
      };
    }
    
    const results = [];
    for (const device of devices) {
      const result = await sendPushNotification(
        device.expoToken, 
        title, 
        body, 
        data
      );
      results.push({ deviceId: device.id, result });
    }
    
    return { 
      success: true, 
      message: "Notifications sent to all devices", 
      results 
    };
  } catch (error) {
    console.error(`Error sending notification to all: ${error}`);
    return { 
      success: false, 
      message: `Failed to send notifications: ${error instanceof Error ? error.message : String(error)}` 
    };
  }
}

/**
 * Send notifications to users based on criteria or role
 */
export async function sendNotificationByFilter(filter: any, title: string, body: string, data: any = {}) {
  try {
    // Get users based on filter
    const users = await prisma.user.findMany({
      where: filter,
      select: { id: true }
    });
    
    if (!users || users.length === 0) {
      return {
        success: false,
        message: "No users match the specified criteria"
      };
    }
    
    const results = [];
    for (const user of users) {
      const result = await sendNotificationToUser(user.id, title, body, data);
      results.push({ userId: user.id, result });
    }
    
    return {
      success: true,
      message: `Notifications sent to ${results.length} users`,
      results
    };
  } catch (error) {
    console.error(`Error sending filtered notifications: ${error}`);
    return {
      success: false,
      message: `Failed to send filtered notifications: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

/**
 * Send a push notification to a specific Expo push token with retry logic
 * @private
 */
async function sendPushNotification(expoToken: string, title: string, body: string, data: any = {}, retryCount = 0): Promise<any> {
  try {
    const message = {
      to: expoToken,
      sound: 'default',
      title,
      body,
      data: data || {}
    };
    
    const response = await axios.post(EXPO_PUSH_API, message, {
      headers: {
        'Accept': 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      }
    });
    
    // Check for errors that indicate the token is invalid
    if (response.status !== 200) {
      console.error(`Error sending push notification: ${JSON.stringify(response.data)}`);
      
      // If we haven't exceeded max retries, try again with exponential backoff
      if (retryCount < MAX_RETRIES) {
        const waitTime = BACKOFF_FACTOR * (2 ** retryCount);
        console.log(`Retrying in ${waitTime} seconds...`);
        await new Promise(resolve => setTimeout(resolve, waitTime * 1000));
        return sendPushNotification(expoToken, title, body, data, retryCount + 1);
      }
      
      return { success: false, error: response.data };
    }
    
    // Check for specific error types in the response
    if (response.data && response.data.data) {
      for (const item of response.data.data) {
        if (item.status === 'error') {
          // Handle DeviceNotRegistered error by removing the token
          if (item.details && item.details.error === 'DeviceNotRegistered') {
            console.warn(`Device not registered: ${expoToken}`);
            await removeDevice(expoToken);
          }
          return { success: false, error: item.message };
        }
      }
    }
    
    return { success: true, data: response.data };
  } catch (error) {
    console.error(`Exception sending push notification: ${error}`);
    
    // If we haven't exceeded max retries, try again with exponential backoff
    if (retryCount < MAX_RETRIES) {
      const waitTime = BACKOFF_FACTOR * (2 ** retryCount);
      console.log(`Retrying in ${waitTime} seconds...`);
      await new Promise(resolve => setTimeout(resolve, waitTime * 1000));
      return sendPushNotification(expoToken, title, body, data, retryCount + 1);
    }
    
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}