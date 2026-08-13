import { YoutubeTranscript } from "youtube-transcript";
import { ValidationError } from "../types/app-error.js";

export async function fetchYoutubeTranscript(url: string) {
    const videoId =
        url.match(
            /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtu\.be\/)([\w-]{11})/,
        )?.[1] ?? url.match(/youtube\.com\/shorts\/([\w-]{11})/)?.[1];

    if (!videoId) {
        throw new ValidationError("Enter a valid YouTube URL");
    }

    let segments;
    try {
        segments = await YoutubeTranscript.fetchTranscript(videoId);
    } catch (err) {
        const message =
            err instanceof Error ? err.message : "";
        if (message.includes("disabled") || message.includes("unavailable")) {
            throw new ValidationError(
                "Transcripts are disabled for this video.",
            );
        }
        throw new ValidationError(
            "Could not fetch transcript. The video may not have captions.",
        );
    }

    const content = segments.map((segment) => segment.text).join(" ").trim();

    if (!content) {
        throw new ValidationError("No transcript found for this video");
    }

    return { videoId, content };
}