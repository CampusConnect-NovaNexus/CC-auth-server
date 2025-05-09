import { Database } from "../lib/db";
import { Request, Response } from "express"

const prisma = Database.getClient();

export const addProfile = async (req: Request, res: Response):Promise<any> => {
  const body = await req.body;
  if (!body.links || !body.userId){
    return res.status(400).json({ error: "Invalid data" });
  }

  const userId = body.userId;
  const links = body.links;

  try {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        aboutMe: links.aboutMe? links.aboutMe : null,
        contactNo: links.contactNo? links.contactNo : null,
        instaLink: links.instagram? links.instagram : null,
        youtubeLink: links.youtube? links.youtube : null,
        githubLink: links.github? links.github : null,
        XLink: links.x? links.x : null,
        leetcodeLink: links.leetcode? links.leetcode : null,
        codeforcesLink: links.codeforces? links.codeforces : null,
      }
    });

    return res.status(200).json({ message: "Socials added successfully" });

  } catch (error) {
    console.error("Error adding socials:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export const getProfile = async (req: Request, res: Response):Promise<any> => {
  const userId = req.params.userId;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      }
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(user);

  } catch (error) {
    console.error("Error fetching socials:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}


