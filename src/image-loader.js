"use client";

export default function myImageLoader({ src, width, quality }) {
    return `https://img.ecwrd.com/image/${src}?w=${width}&q=${quality || 75}`;
}
