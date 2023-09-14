import { json, createCookieSessionStorage, redirect } from "@remix-run/node";
import { db } from "./prisma.server";
import type { RegisterForm, LoginForm } from "./types.server";
import { createUser } from "./users.server";
import bcrypt from "bcryptjs";
const secret = process.env.SESSION_SECRET;


if (!secret) {
  throw new Error("Session secret is not set.");
}

const storage = createCookieSessionStorage({
  cookie: {
    name: "admin-session",
    secure: process.env.NODE_ENV === "production",
    secrets: [secret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

export const register = async (form: RegisterForm) => {
  const exists = await db.admin.count({ where: { email: form.email } });
  console.log(exists);
  if (exists) {
    json({ error: "User already exists" }, { status: 400 });
  }

  const newUser = await createUser(form);

  if (!newUser) {
    return json(
      {
        error: "User already exists",
        fields: { email: form.email, password: form.password },
      },
      {
        status: 400,
      }
    );
  }
  return createUserSession(newUser.id, '/');
};

export const login = async (form: LoginForm) => {
  const user = await db.admin.findUnique({
    where: { email: form.email },
  });


  if (!user || !(await bcrypt.compare(form.password, user.password))) {
    return json({ error: "User not found" }, { status: 400 });
  }

  return createUserSession(user.id, '/');
};

export const createUserSession = async (userId: string, redirectTo: string) => {
  const session = await storage.getSession();
  session.set("userId", userId);

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
};

//This two functions are used to redirect to the login screen
export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
){
  const session = await getUserSession(request);
  const userId = session.get('userId');
  if (!userId || typeof userId !== 'string'){
    const searchParams =new URLSearchParams ([["redirectTo", redirectTo]])
    throw redirect(`/login?${searchParams}`)
  }
  return userId
}

function getUserSession (request: Request){
  // return storage.getSession(request.headers.get('cookie'))
return storage.getSession(request.headers.get('cookie'))  
}

//The following functions are used to redirect to the user to the home screen if the user was logged in or destroy
//their session if we don't find a user or a session

async function getUserId(request: Request) {
  const session = await getUserSession(request);
  const userId = session.get('userId');
  if (!userId || typeof userId !== 'string') return null;
  return userId;
}

export async function getUser(request: Request){
  const userId = await getUserId(request);
  if (typeof userId !== 'string') {
    return null;
  }
    const user = await db.admin.findUnique({
      where: { id: userId},
      select: {id:true, email:true, password:true,}
    });
    return user;
  } 





