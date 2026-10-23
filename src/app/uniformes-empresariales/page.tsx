import { TopicPage } from "@/components/TopicPage";
import { topicMetadata } from "@/lib/topics";

export const metadata = topicMetadata("uniformes-empresariales");

export default function Page() {
  return <TopicPage slug="uniformes-empresariales" />;
}
