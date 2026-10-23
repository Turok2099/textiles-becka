import { TopicPage } from "@/components/TopicPage";
import { topicMetadata } from "@/lib/topics";

export const metadata = topicMetadata("articulos-promocionales");

export default function Page() {
  return <TopicPage slug="articulos-promocionales" />;
}
