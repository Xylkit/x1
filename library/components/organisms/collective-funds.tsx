import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/atoms/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/atoms/alert";
import Card from "@/components/atoms/card";
import { FundingBody, FundingHead } from "@/components/molecules/funding";
import NewCollectiveFund from "@/components/molecules/new-collective-fund";
import { CollectiveFund } from "@/types";

const CollectiveFunds = ({ funds }: { funds: CollectiveFund[] }) => {
  return (
    <div className="flex flex-col gap-4">
      <Alert>
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          Switch to the Info tab, to get tokens from this collective's faucet...
          for testing!
        </AlertDescription>
      </Alert>
      <NewCollectiveFund />
      <Accordion
        type="single"
        collapsible
        className="w-full flex flex-col gap-2"
      >
        {funds.map((item) => (
          <Card key={item.id} className="rounded-lg p-0">
            <AccordionItem value={item.id.toString()} className="border-b-0">
              <AccordionTrigger className="p-4">
                <FundingHead item={item} />
              </AccordionTrigger>
              <AccordionContent className="pb-4 px-4">
                <FundingBody item={item} />
              </AccordionContent>
            </AccordionItem>
          </Card>
        ))}
      </Accordion>
    </div>
  );
};

export default CollectiveFunds;
