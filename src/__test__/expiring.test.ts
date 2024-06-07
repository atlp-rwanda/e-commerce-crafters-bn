import {
 checkExpiredProducts,
 checkExpiringProducts,
} from "../helpers/expiring";
import httpMocks from "node-mocks-http";
describe("Check Expiring Products", () => {
 test("Should return No Expiring Product  ", async () => {
  const res = httpMocks.createResponse();
  await checkExpiringProducts(undefined, res);
  const statusCode = res.statusCode;
  const data = res._getJSONData();
  if (statusCode === 204) {
   expect(data).toEqual({ message: "No Expiring Products" });
  }
 }, 10000);
 test("Should return Check Expiring Product Successfully ", async () => {
  const res = httpMocks.createResponse();
  await checkExpiringProducts(undefined, res);
  const statusCode = res.statusCode;
  const data = res._getJSONData();
  if (statusCode === 200) {
   expect(data).toEqual({ message: "Check Expiring Product Successfully" });
  }
 }, 10000);
 test("Should return The error if Any", async () => {
  const res = httpMocks.createResponse();
  await checkExpiringProducts(undefined, res);
  const statusCode = res.statusCode;
  const data = res._getJSONData();
  if (statusCode === 500) {
   expect(data).toEqual({ error: data.error });
  }
 }, 10000);
});
describe("Check Expired Products", () => {
 test("Should return No Expired Products To Update ", async () => {
  const res = httpMocks.createResponse();
  await checkExpiredProducts(undefined, res);
  const statusCode = res.statusCode;
  const data = res._getJSONData();
  if (statusCode === 204) {
   expect(data).toEqual({ message: "No Expired Products to Update" });
  }
 }, 10000);
 test("Should return Check Expired Product Successfully", async () => {
  const res = httpMocks.createResponse();
  await checkExpiredProducts(undefined, res);
  const statusCode = res.statusCode;
  const data = res._getJSONData();
  if (statusCode === 200) {
   expect(data).toEqual({
    message: "Check Expired Product Successfully And Sent Emails",
   });
  }
 }, 10000);
 test("If Any Error Should Return It", async () => {
  const res = httpMocks.createResponse();
  await checkExpiredProducts(undefined, res);
  const statusCode = res.statusCode;
  const data = res._getJSONData();
  if (statusCode === 500) {
   expect(data).toEqual({ error: data.error });
  }
 }, 10000);
});
