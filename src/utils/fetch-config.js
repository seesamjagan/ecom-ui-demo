export const fetchConfig = (payload, method="POST") => {
    return {
        method,
        headers: {
          "Content-Type": "application/json" // important to set. will have impact in req.body in expressJS
        },
        body: JSON.stringify(payload)
      }
}