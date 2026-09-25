const rateLimitMap = new Map();

export default function emailRateLimitMiddleware(handler) {
    return (req, res) => {
        const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
        const limit = 6; // Limiting requests to 6 per day per IP
        const windowMs = 24* 60 * 60 * 1000; // 1 day

        if (!rateLimitMap.has(ip)) {
            rateLimitMap.set(ip, {
                count: 0,
                lastReset: Date.now(),
            });
        }

        const ipData = rateLimitMap.get(ip);

        if (Date.now() - ipData.lastReset > windowMs) {
            ipData.count = 0;
            ipData.lastReset = Date.now();
        }

        if (ipData.count >= limit) {
            return res.status(429).send("Too Many Requests");
        }

        ipData.count += 1;

        return handler(req, res);
    };
}