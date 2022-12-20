import http from "k6/http";
import { sleep, check } from "k6";

export const options = {
  stages: [
    { duration: "10s", target: 5 },
    { duration: "5s", target: 100 },
    { duration: "1m", target: 500 },
    { duration: "10s", target: 300 },
    { duration: "5s", target: 200 },
    { duration: "10s", target: 10 },
  ],

  thresholds: {
    http_req_duration: ["p(99)<1500"], // 99% of requests must complete below 1.5s
  },
};

const BASE_URL = "http://localhost:4000/api/v1/todos";

export default function () {
  const resp = http.get(`${BASE_URL}`);

  check(resp, {
    "is status 200": (r) => r.status === 200,
  });

  const body = resp.json();

  check(body, {
    "Body contains code": (r) => r.code !== undefined,
    "Body contains data": (r) => r.data !== undefined && Array.isArray(r.data),
  });

  sleep(1);
}
