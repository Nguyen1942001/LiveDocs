"use server";

import { nanoid } from "nanoid";
import { liveblocks } from "../liveblocks";
import { revalidatePath } from "next/cache";
import { parseStringify } from "../utils";

export const createDocument = async ({
  userId,
  email,
}: CreateDocumentParams) => {
  const roomId = nanoid();

  try {
    const metadata = {
      creatorId: userId,
      email: email,
      title: "Untitled",
    };

    const usersAccesses: RoomAccesses = {
      [email]: ["room:write"],
    };

    const room = await liveblocks.createRoom(roomId, {
      defaultAccesses: [],
      usersAccesses,
      metadata,
    });

    // Redirect to the room
    revalidatePath("/");

    // Return the room
    return parseStringify(room);
  } catch (error) {
    console.error(`Error happened while creating room: ${error}`);
  }
};
