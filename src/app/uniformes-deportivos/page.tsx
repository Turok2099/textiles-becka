import { TopicPage } from "@/components/TopicPage";
import { topicMetadata } from "@/lib/topics";

export const metadata = topicMetadata("uniformes-deportivos");

export default function Page() {
  return <TopicPage slug="uniformes-deportivos" />;
}
