import { TopicPage } from "@/components/TopicPage";
import { topicMetadata } from "@/lib/topics";

export const metadata = topicMetadata("playeras-personalizadas");

export default function Page() {
  return <TopicPage slug="playeras-personalizadas" />;
}
