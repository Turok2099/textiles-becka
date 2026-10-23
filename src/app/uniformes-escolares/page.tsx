import { TopicPage } from "@/components/TopicPage";
import { topicMetadata } from "@/lib/topics";

export const metadata = topicMetadata("uniformes-escolares");

export default function Page() {
  return <TopicPage slug="uniformes-escolares" />;
}
