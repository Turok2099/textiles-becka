import { TopicPage } from "@/components/TopicPage";
import { topicMetadata } from "@/lib/topics";

export const metadata = topicMetadata("sublimacion");

export default function Page() {
  return <TopicPage slug="sublimacion" />;
}
