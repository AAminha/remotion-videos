import { Scene } from "../schema";
import { Chat } from "./Chat";
import { Code } from "./Code";
import { Flow } from "./Flow";
import { Grid } from "./Grid";
import { Hero } from "./Hero";
import { List } from "./List";
import { Sequence } from "./Sequence";
import { Stat } from "./Stat";

export const SceneRenderer: React.FC<{ scene: Scene }> = ({ scene }) => {
  switch (scene.type) {
    case "hero":
      return <Hero {...scene} />;
    case "list":
      return <List {...scene} />;
    case "grid":
      return <Grid {...scene} />;
    case "code":
      return <Code {...scene} />;
    case "flow":
      return <Flow {...scene} />;
    case "chat":
      return <Chat {...scene} />;
    case "stat":
      return <Stat {...scene} />;
    case "sequence":
      return <Sequence {...scene} />;
  }
};
