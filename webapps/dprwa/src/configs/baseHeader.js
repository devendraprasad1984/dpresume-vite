export default function BaseHeader(method = "GET") {
  return {
    method,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
}
