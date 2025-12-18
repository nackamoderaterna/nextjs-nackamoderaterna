// utils/videoBlock.ts

export type VideoType = "youtube" | "vimeo" | "unsupported";

interface VideoInfo {
  type: VideoType;
  id: string;
}

export class VideoBlockUtils {
  static parseVideoUrl(url: string): VideoInfo {
    // YouTube patterns - supports multiple URL formats:
    // - https://www.youtube.com/watch?v=VIDEO_ID
    // - https://youtu.be/VIDEO_ID
    // - https://www.youtube.com/embed/VIDEO_ID
    // - https://www.youtube.com/watch?v=VIDEO_ID&feature=share
    const youtubePatterns = [
      /(?:youtube\.com\/watch\?v=)([^&\s?]+)/, // Standard watch URL
      /(?:youtu\.be\/)([^&\s?]+)/, // Shortened URL
      /(?:youtube\.com\/embed\/)([^&\s?]+)/, // Embed URL
      /(?:youtube\.com\/v\/)([^&\s?]+)/, // Old embed format
      /(?:youtube\.com\/shorts\/)([^&\s?]+)/, // YouTube Shorts
    ];

    for (const pattern of youtubePatterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return { type: "youtube", id: match[1] };
      }
    }

    // Vimeo pattern - supports:
    // - https://vimeo.com/123456789
    // - https://player.vimeo.com/video/123456789
    const vimeoPatterns = [
      /vimeo\.com\/(\d+)/, // Standard Vimeo URL
      /player\.vimeo\.com\/video\/(\d+)/, // Player URL
    ];

    for (const pattern of vimeoPatterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return { type: "vimeo", id: match[1] };
      }
    }

    // Direct video URL (fallback)
    return { type: "unsupported", id: url };
  }

  /**
   * Generate YouTube embed URL with optional autoplay and loop
   * @param videoId - YouTube video ID
   * @param autoplay - Enable autoplay (will also mute for browser compatibility)
   * @param loop - Enable video looping
   * @returns Full YouTube embed URL with query parameters
   *
   * @example
   * getYoutubeEmbedUrl('dQw4w9WgXcQ', true, true)
   * // Returns: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1&loop=1&playlist=dQw4w9WgXcQ'
   */
  static getYoutubeEmbedUrl(
    videoId: string,
    autoplay: boolean = false,
    loop: boolean = false,
  ): string {
    const params = new URLSearchParams();

    if (autoplay) {
      params.append("autoplay", "1");
      params.append("mute", "1"); // Autoplay requires mute for browser autoplay policies
    }

    if (loop) {
      params.append("loop", "1");
      params.append("playlist", videoId); // Loop requires playlist parameter with video ID
    }

    const queryString = params.toString();
    return `https://www.youtube.com/embed/${videoId}${queryString ? `?${queryString}` : ""}`;
  }

  static getVimeoEmbedUrl(
    videoId: string,
    autoplay: boolean = false,
    loop: boolean = false,
  ): string {
    const params = new URLSearchParams();
    if (autoplay) {
      params.append("autoplay", "1");
      params.append("muted", "1"); // Autoplay requires mute
    }
    if (loop) params.append("loop", "1");

    const queryString = params.toString();
    return `https://player.vimeo.com/video/${videoId}${queryString ? `?${queryString}` : ""}`;
  }

  static getVideoEmbedUrl(
    url: string,
    autoplay: boolean = false,
    loop: boolean = false,
  ): string {
    const videoInfo = this.parseVideoUrl(url);

    switch (videoInfo.type) {
      case "youtube":
        return this.getYoutubeEmbedUrl(videoInfo.id, autoplay, loop);
      case "vimeo":
        return this.getVimeoEmbedUrl(videoInfo.id, autoplay, loop);
      case "unsupported":
        return videoInfo.id;
      default:
        return url;
    }
  }

  static isEmbeddableVideo(url: string): boolean {
    const videoInfo = this.parseVideoUrl(url);
    return videoInfo.type === "youtube" || videoInfo.type === "vimeo";
  }
}
