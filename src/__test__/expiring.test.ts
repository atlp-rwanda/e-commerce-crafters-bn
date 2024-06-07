// import { checkExpiringProducts } from "../helpers/expiring";

// describe("CheckExpringProducts", () => {
//  test("Should Return An Object or false ", async () => {
//   const result = await checkExpiringProducts();
//   expect(typeof result === "boolean" || typeof result === "object").toBe(true);
//  });
//  test("Check if the Keys are emails and values is array of string of products ", async () => {
//   const result = await checkExpiringProducts();
//   if (typeof result === "object") {
//    for (const key in result) {
//     expect(validateEmail(key)).toBe(true);
//     expect(Array.isArray(result[key])).toBe(true);
//     result[key].forEach((product) => {
//      expect(typeof product).toBe("string");
//     });
//    }
//   }
//  });
// });

// function validateEmail(email: string): boolean {
//  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//  return emailPattern.test(email);
// }
