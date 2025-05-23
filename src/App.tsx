import { animate, createScope, createSpring, waapi } from "animejs";
import {
  Accordion,
  Badge,
  Box,
  Center,
  Drawer,
  For,
  HStack,
  Portal,
  RadioCard,
  Span,
  Stack,
} from "@chakra-ui/react";
import { memo, useCallback, useEffect, useRef, useState } from "react";

// list of categories and their counts
const cats: { title: string; count: number }[] = [
  { title: "Action", count: 8 },
  { title: "Drama", count: 8 },
  { title: "Fun", count: 8 },
  { title: "Love", count: 8 },
  { title: "Comedy", count: 7 },
];

export default function App() {
  /*const root = useRef(null);
  const scope = useRef(null);
  // useEffect for animation
  // scopes to wherever 'root' is (name can be different)
  // check animejs for more info
  // span needed to animate text with Chakra
  useEffect(() => {
    scope.current = createScope({ root }).add((self) => {
      // bouncy expand/contract
      animate(".animate-me", {
        scale: [
          { to: 1.5, ease: "inOut(3)", duration: 200 },
          { to: 1, ease: createSpring({ stiffness: 300 }) },
        ],
        loop: true,
        loopDelay: 250,
      });
    });
    return () => scope.current.revert();
  }, []);*/

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
          onOpenChange={(openSection) => setOpenSection(openSection.open)}
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

// construct accordions for each category
// input = list of categories and their counts
const GenerateCategories = memo(({ cats, votedSections, onVote, onOpen }) => {
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

// construct radio cards for each video in the given category
// input = title of category, number of videos in that category
const GenerateVoting = memo(({ title, category, count, onVote, onOpen }) => {
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
                  value={col + 1}
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
