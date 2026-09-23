// import { NextResponse } from "next/server";

// export function middleware(req) {
//   const token = req.cookies.get("accessToken")?.value;
//   const { pathname } = req.nextUrl;

//   const isPublic = pathname === "/";

//   if (!token && !isPublic) {
//     return NextResponse.redirect(new URL("/", req.url));
//   }

//   if (token && isPublic) {
//     return NextResponse.redirect(new URL("/dashboard", req.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/", "/dashboard/:path*"],
// };

// import { NextResponse } from "next/server";

// export function middleware(req) {
//   const token = req.cookies.get("accessToken")?.value;
//   const { pathname } = req.nextUrl;

//   console.log("========== MIDDLEWARE ==========");
//   console.log("Path:", pathname);
//   console.log("Method:", req.method);
//   console.log("Token Exists:", !!token);
//   console.log("Token:", token ? `${token.substring(0, 20)}...` : "NOT FOUND");

//   const isPublic = pathname === "/";

//   console.log("Is Public Route:", isPublic);

//   if (!token && !isPublic) {
//     console.log("❌ No token -> Redirecting to /");
//     return NextResponse.redirect(new URL("/", req.url));
//   }

//   if (token && isPublic) {
//     console.log("✅ Token found -> Redirecting to /dashboard");
//     return NextResponse.redirect(new URL("/dashboard", req.url));
//   }

//   console.log("✅ Allowing request:", pathname);
//   console.log("================================");

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/", "/dashboard/:path*"],
// };


import { NextResponse } from "next/server";

export function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*"],
};