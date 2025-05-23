import {
  Accordion,
  Badge,
  Box,
  Center,
  Drawer,
  HStack,
  Portal,
  RadioCard,
  Span,
  Stack,
} from "@chakra-ui/react";
import { memo, useCallback, useState } from "react";

// list of categories and their counts
const cats: { title: string; count: number }[] = [
  { title: "Action", count: 8 },
  { title: "Drama", count: 8 },
  { title: "Fun", count: 8 },
  { title: "Love", count: 8 },
  { title: "Comedy", count: 7 },
];

export default function App() {
  // track votes per category
  const [votedSections, setVotedSections] = useState<{
    [category: string]: string[];
  }>({});

  // drawers
  const [openSection, setOpenSection] = useState<string | null>(null);

  const handleOpen = useCallback((section: string) => {
    setOpenSection(section);
  }, []);

  const handleVote = useCallback((category: string, section: string) => {
    setVotedSections((prev) => {
      const currentVotes = prev[category] || [];
      if (!currentVotes.includes(section)) {
        return {
          ...prev,
          [category]: [...currentVotes, section],
        };
      }
      return prev;
    });
  }, []);

  return (
    <div /*ref={root}*/>
      <Center>
        <Box w="100%" maxWidth="98%">
          <GenerateCategories
            cats={cats}
            votedSections={votedSections}
            onVote={handleVote}
            onOpen={handleOpen}
          />
        </Box>
      </Center>
      {/* GLOBAL DRAWER, only mounted when openSection != null */}
      {openSection && (
        <Drawer.Root
          open={!!openSection}
          placement="top"
          onOpenChange={(open: boolean) => setOpenSection(open ? openSection : null)}
          size="md"
          lazyMount
        >
          <Portal>
            <Drawer.Backdrop />
            <Drawer.Positioner p="4">
              <Drawer.Content rounded="md">
                <Drawer.CloseTrigger />
                <Drawer.Header>
                  <Drawer.Title>{openSection}</Drawer.Title>
                </Drawer.Header>
                <Drawer.Body>
                  <p>Video Title:</p>
                  <p>Editor:</p>
                  <p>Song:</p>
                  <p>Video Used:</p>
                </Drawer.Body>
                <Drawer.Footer />
              </Drawer.Content>
            </Drawer.Positioner>
          </Portal>
        </Drawer.Root>
      )}
    </div>
  );
}

type GenerateCategoriesProps = {
  cats: { title: string; count: number }[];
  votedSections: { [category: string]: string[] };
  onVote: (category: string, section: string) => void;
  onOpen: (section:string) => void;
};

// construct accordions for each category
// input = list of categories and their counts
const GenerateCategories = memo(
  ({ cats, votedSections, onVote, onOpen }: GenerateCategoriesProps) => {
  return (
    <Accordion.Root multiple variant="subtle">
      {cats.map((cat, index) => {
        const currentCount = votedSections[cat.title]?.length || 0;
        const isComplete = currentCount === cat.count;
        return (
          <Accordion.Item key={index} value={cat.title}>
            <Accordion.ItemTrigger>
              <Span flex="1">
                {cat.title}
                <Badge colorPalette={isComplete ? "green" : "red"} ml={2}>
                  {currentCount} of {cat.count}
                </Badge>
              </Span>
              <Accordion.ItemIndicator /*className="animate-me"*/ />
            </Accordion.ItemTrigger>
            <Accordion.ItemContent>
              <Accordion.ItemBody>
                <GenerateVoting
                  title={cat.title[0]}
                  category={cat.title}
                  count={cat.count}
                  onVote={onVote}
                  onOpen={onOpen}
                />
              </Accordion.ItemBody>
            </Accordion.ItemContent>
          </Accordion.Item>
        );
      })}
    </Accordion.Root>
  );
});

type GenerateVotingProps = {
  title: string;
  category: string;
  count:number;
  onVote: (category: string, section: string) => void;
  onOpen: (section: string) => void;
};

// construct radio cards for each video in the given category
// input = title of category, number of videos in that category
const GenerateVoting = memo(
  ({ title, category, count, onVote, onOpen }: GenerateVotingProps) => {
  return (
    <Stack>
      {Array.from({ length: count }, (_, row) => {
        const section = `${title}${row + 1}`;
        return (
          <RadioCard.Root
            orientation="vertical"
            colorPalette="blue"
            key={section}
            align="center"
            justify="center"
            onValueChange={() => onVote(category, section)}
          >
            <HStack>
              <RadioCard.Label
                minWidth="60px"
                fontSize="2em"
                color="blue"
                onClick={() => onOpen(section)}
              >
                {section}
              </RadioCard.Label>
              {Array.from({ length: 5 }, (_, col) => (
                <RadioCard.Item
                  key={`${section}-${col + 1}`}
                  className={`${section}-${col + 1}`}
                >
                  <RadioCard.ItemHiddenInput />
                  <RadioCard.ItemControl>
                    <RadioCard.ItemText>{col + 1}</RadioCard.ItemText>
                  </RadioCard.ItemControl>
                </RadioCard.Item>
              ))}
            </HStack>
          </RadioCard.Root>
        );
      })}
    </Stack>
  );
});
