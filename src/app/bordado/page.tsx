import { TopicPage } from "@/components/TopicPage";
import { topicMetadata } from "@/lib/topics";

export const metadata = topicMetadata("bordado");

export default function Page() {
  return <TopicPage slug="bordado" />;
}
