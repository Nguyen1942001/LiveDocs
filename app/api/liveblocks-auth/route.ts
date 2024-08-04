import { liveblocks } from "@/lib/liveblocks";
import { getRandomColor, getUserColor } from "@/lib/utils";
import { currentUser, EmailAddress } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function POST(request: Request) {
  // Get info user from Clerk
  const clerkUser = await currentUser();
  if (!clerkUser) {
    redirect("sign-in");
  }

  const { id, firstName, lastName, emailAddresses, imageUrl } = clerkUser;

  // Create a user object to identify the user
  const user = {
    id: clerkUser.id,
    info: {
      id,
      name: `${firstName} ${lastName}`,
      email: emailAddresses[0].emailAddress,
      avatar: imageUrl,
      color: getUserColor(id),
    },
  };

  // Identify the user and return the result
  const { status, body } = await liveblocks.identifyUser(
    {
      userId: user.info.email,
      groupIds: [], // Optional
    },
    { userInfo: user.info }
  );

  return new Response(body, { status });
}
