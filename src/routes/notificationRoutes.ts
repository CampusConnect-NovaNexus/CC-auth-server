import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import { 
  registerDevice, 
  updateDeviceToken, 
  removeDevice, 
  sendNotificationToUser, 
  sendNotificationToAll,
  sendNotificationByFilter 
} from '../services/notificationService';
import { isValidToken, verifyJWT } from '../lib/jwt';

console.log('🔔 Notification routes module loaded');
const router = express.Router();

// Define custom interface to extend Express Request type
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    roles?: string[];
  };
}

// Handler function to properly type async route handlers
const asyncHandler = (fn: (req: AuthenticatedRequest, res: Response) => Promise<any>): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req as AuthenticatedRequest, res))
      .catch(next);
  };
};

/**
 * Register a device for push notifications
 * @route POST /api/notifications/register
 * @body {expoToken: string, platform: string}
 */
router.post('/register', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  console.log('🔔 POST /register: Received registration request', {
    body: req.body,
    headers: {
      'content-type': req.headers['content-type'],
      // Hide authorization token for security
      'authorization': req.headers['authorization'] ? '[PRESENT]' : '[MISSING]'
    }
  });
  
  try {
    const userId = req.body.userId; 
    if (!userId) {
      console.log('🔔 POST /register: Unauthorized request - no valid user ID');
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { expoToken, platform } = req.body;
    console.log(`🔔 POST /register: Processing registration for user: ${userId}`, { expoToken, platform });
    
    if (!expoToken || !platform) {
      console.log('🔔 POST /register: Missing required fields', { expoToken: !!expoToken, platform: !!platform });
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    
    console.log(`🔔 POST /register: Calling registerDevice service for user: ${userId}`);
    const result = await registerDevice(userId, expoToken, platform);
    
    console.log(`🔔 POST /register: Service result:`, result);
    if (!result.success) {
      console.log(`🔔 POST /register: Registration failed: ${result.message}`);
      return res.status(500).json(result);
    }
    
    const statusCode = result.message === 'Device registered successfully' ? 201 : 200;
    console.log(`🔔 POST /register: Registration successful, returning status ${statusCode}`);
    return res.status(statusCode).json(result);
  } catch (error) {
    console.error(`🔔 POST /register: Exception in registration route:`, error);
    return res.status(500).json({ 
      success: false, 
      message: `Server error: ${error instanceof Error ? error.message : String(error)}` 
    });
  }
}));

/**
 * Update an existing device token
 * @route PUT /api/notifications/update
 * @body {oldToken: string, newToken: string, platform: string}
 */
router.put('/update', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  console.log('🔔 PUT /update: Received token update request', {
    body: req.body
  });
  
  try {
    const userId = req.body.userId;
    if (!userId) {
      console.log('🔔 PUT /update: Unauthorized request - no valid user ID');
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { oldToken, newToken, platform } = req.body;
    console.log(`🔔 PUT /update: Processing token update for user: ${userId}`, { 
      oldToken,
      newToken, 
      platform 
    });
    
    if (!oldToken || !newToken || !platform) {
      console.log('🔔 PUT /update: Missing required fields', {
        oldToken: !!oldToken,
        newToken: !!newToken,
        platform: !!platform
      });
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    
    console.log('🔔 PUT /update: Calling updateDeviceToken service');
    const result = await updateDeviceToken(oldToken, newToken, platform);
    
    console.log('🔔 PUT /update: Service result:', result);
    if (!result.success) {
      console.log(`🔔 PUT /update: Token update failed: ${result.message}`);
      return res.status(404).json(result);
    }
    
    console.log('🔔 PUT /update: Token update successful');
    return res.status(200).json(result);
  } catch (error) {
    console.error(`🔔 PUT /update: Exception in token update route:`, error);
    return res.status(500).json({ 
      success: false, 
      message: `Server error: ${error instanceof Error ? error.message : String(error)}` 
    });
  }
}));

/**
 * Unregister a device
 * @route DELETE /api/notifications/unregister
 * @body {expoToken: string}
 */
router.delete('/unregister', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  console.log('🔔 DELETE /unregister: Received unregister request', {
    body: req.body
  });
  
  try {
    const userId = req.body.userId;
    if (!userId) {
      console.log('🔔 DELETE /unregister: Unauthorized request - no valid user ID');
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { expoToken } = req.body;
    console.log(`🔔 DELETE /unregister: Processing unregister for user: ${userId}`, { expoToken });
    
    if (!expoToken) {
      console.log('🔔 DELETE /unregister: Missing expo token', { expoToken: !!expoToken });
      return res.status(400).json({ success: false, message: 'Missing expo token' });
    }
    
    console.log(`🔔 DELETE /unregister: Calling removeDevice service for user: ${userId}`);
    const result = await removeDevice(expoToken);
    
    console.log(`🔔 DELETE /unregister: Service result:`, result);
    if (!result.success) {
      console.log(`🔔 DELETE /unregister: Unregister failed: ${result.message}`);
      return res.status(404).json(result);
    }
    
    console.log(`🔔 DELETE /unregister: Unregister successful`);
    return res.status(200).json(result);
  } catch (error) {
    console.error(`🔔 DELETE /unregister: Exception in unregister route:`, error);
    return res.status(500).json({ 
      success: false, 
      message: `Server error: ${error instanceof Error ? error.message : String(error)}` 
    });
  }
}));

/**
 * Send notification to a specific user
 * @route POST /api/notifications/send/user/:userId
 * @body {title: string, body: string, data?: any}
 * @access Admin only
 */
router.post('/send/user/:userId', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  console.log('🔔 POST /send/user/:userId: Received send notification request', {
    params: req.params,
    body: req.body
  });
  
  try {
    // Check if user has admin role
    console.log('🔔 POST /send/user/:userId: Checking admin role', {
      userRoles: req.user?.roles
    });
    
    if (!req.user?.roles?.includes('ADMIN')) {
      console.log('🔔 POST /send/user/:userId: Forbidden - user is not an admin');
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const { userId } = req.params;
    const { title, body, data } = req.body;
    
    console.log(`🔔 POST /send/user/:userId: Processing notification to user: ${userId}`, {
      title,
      bodyLength: body?.length,
      hasData: !!data
    });
    
    if (!userId || !title || !body) {
      console.log('🔔 POST /send/user/:userId: Missing required fields', {
        userId: !!userId,
        title: !!title,
        body: !!body
      });
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    
    console.log(`🔔 POST /send/user/:userId: Calling sendNotificationToUser service for user: ${userId}`);
    const result = await sendNotificationToUser(userId, title, body, data || {});
    
    console.log('🔔 POST /send/user/:userId: Service result:', result);
    if (!result.success) {
      console.log(`🔔 POST /send/user/:userId: Failed to send notification: ${result.message}`);
      return res.status(404).json(result);
    }
    
    console.log('🔔 POST /send/user/:userId: Notification sent successfully');
    return res.status(200).json(result);
  } catch (error) {
    console.error(`🔔 POST /send/user/:userId: Exception in send notification route:`, error);
    return res.status(500).json({ 
      success: false, 
      message: `Server error: ${error instanceof Error ? error.message : String(error)}` 
    });
  }
}));

/**
 * Send notification to all users
 * @route POST /api/notifications/send/all
 * @body {title: string, body: string, data?: any}
 * @access Admin only
 */
router.post('/send/all', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  console.log('🔔 POST /send/all: Received send notification to all request', {
    body: req.body
  });
  
  try {
    // Check if user has admin role
    console.log('🔔 POST /send/all: Checking admin role', {
      userRoles: req.user?.roles
    });
    
    if (!req.user?.roles?.includes('ADMIN')) {
      console.log('🔔 POST /send/all: Forbidden - user is not an admin');
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const { title, body, data } = req.body;
    
    console.log(`🔔 POST /send/all: Processing notification to all users`, {
      title,
      bodyLength: body?.length,
      hasData: !!data
    });
    
    if (!title || !body) {
      console.log('🔔 POST /send/all: Missing required fields', {
        title: !!title,
        body: !!body
      });
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    
    console.log(`🔔 POST /send/all: Calling sendNotificationToAll service`);
    const result = await sendNotificationToAll(title, body, data || {});
    
    console.log('🔔 POST /send/all: Service result:', result);
    if (!result.success) {
      console.log(`🔔 POST /send/all: Failed to send notification: ${result.message}`);
      return res.status(404).json(result);
    }
    
    console.log('🔔 POST /send/all: Notification sent successfully');
    return res.status(200).json(result);
  } catch (error) {
    console.error(`🔔 POST /send/all: Exception in send all notifications route:`, error);
    return res.status(500).json({ 
      success: false, 
      message: `Server error: ${error instanceof Error ? error.message : String(error)}` 
    });
  }
}));

/**
 * Send notification to users by role
 * @route POST /api/notifications/send/role/:role
 * @body {title: string, body: string, data?: any}
 * @access Admin only
 */
router.post('/send/role/:role', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  console.log('🔔 POST /send/role/:role: Received send notification by role request', {
    params: req.params,
    body: req.body
  });
  
  try {
    // Check if user has admin role
    console.log('🔔 POST /send/role/:role: Checking admin role', {
      userRoles: req.user?.roles
    });
    
    if (!req.user?.roles?.includes('ADMIN')) {
      console.log('🔔 POST /send/role/:role: Forbidden - user is not an admin');
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const { role } = req.params;
    const { title, body, data } = req.body;
    
    console.log(`🔔 POST /send/role/:role: Processing notification to users with role: ${role}`, {
      title,
      bodyLength: body?.length,
      hasData: !!data
    });
    
    if (!role || !title || !body) {
      console.log('🔔 POST /send/role/:role: Missing required fields', {
        role: !!role,
        title: !!title,
        body: !!body
      });
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    
    // Create filter for users with specific role
    const filter = {
      roles: {
        has: role
      }
    };
    
    console.log(`🔔 POST /send/role/:role: Calling sendNotificationByFilter service`);
    const result = await sendNotificationByFilter(filter, title, body, data || {});
    
    console.log('🔔 POST /send/role/:role: Service result:', result);
    if (!result.success) {
      console.log(`🔔 POST /send/role/:role: Failed to send notification: ${result.message}`);
      return res.status(404).json(result);
    }
    
    console.log('🔔 POST /send/role/:role: Notification sent successfully');
    return res.status(200).json(result);
  } catch (error) {
    console.error(`🔔 POST /send/role/:role: Exception in send by role route:`, error);
    return res.status(500).json({ 
      success: false, 
      message: `Server error: ${error instanceof Error ? error.message : String(error)}` 
    });
  }
}));

export default router;