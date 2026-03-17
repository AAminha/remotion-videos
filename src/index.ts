// This is your entry file! Refer to it when you render:
// npx remotion render <entry-file> HelloWorld out/video.mp4

import { registerRoot } from "remotion";
import { RemotionRoot } from "./Root";

// Remotion에게 "이게 루트야"라고 알려주는 함수.
registerRoot(RemotionRoot);
