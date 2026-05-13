const crawlers = ["googlebot", "duckduckbot", "bingbot"];

const ua = navigator.userAgent.toLowerCase();

const isCrawler = crawlers.some((crawler) => ua.includes(crawler));

export default isCrawler;
