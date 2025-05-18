import { animate, createScope, createSpring, waapi } from "animejs";
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
import { useEffect, useRef, useState } from "react";

export default function App() {
  const root = useRef(null);
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
  }, []);

  // list of categories and their counts
  const cats: { title: string; count: number }[] = [
    { title: "Action", count: 8 },
    { title: "Drama", count: 8 },
    { title: "Fun", count: 8 },
    { title: "Love", count: 8 },
    { title: "Comedy", count: 7 },
  ];

  return (
    <div ref={root}>
      <Center>
        <Box w="100%" maxWidth="98%">
          <GenerateCategories cats={cats} />
        </Box>
      </Center>
    </div>
  );
}

// construct accordions for each category
// input = list of categories and their counts
const GenerateCategories = ({ cats }) => {
  return (
    <Accordion.Root multiple variant="subtle">
      {cats.map((cat, index) => (
        <Accordion.Item key={index} value={cat.title}>
          <Accordion.ItemTrigger>
            <Span flex="1">
              {cat.title}
              <Badge colorPalette="red">0 of {cat.count}</Badge>
            </Span>
            <Accordion.ItemIndicator className="animate-me" />
          </Accordion.ItemTrigger>
          <Accordion.ItemContent>
            <Accordion.ItemBody>
              <GenerateVoting title={cat.title[0]} count={cat.count} />
            </Accordion.ItemBody>
          </Accordion.ItemContent>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
};

// construct radio cards for each video in the given category
// input = title of category, number of videos in that category
const GenerateVoting = ({ title, count }) => {
  return (
    <Stack>
      {Array.from({ length: count }, (_, row) => (
        <RadioCard.Root
          orientation="vertical"
          colorPalette="blue"
          key={`${title}-${row + 1}`}
          align="center"
          justify="center"
          defaultValue="next"
        >
          <HStack>
            <RadioCard.Label minWidth="60px" fontSize="2em" color="blue">
              <Drawer.Root size="md" placement="top">
                <Drawer.Trigger className="animate-me">
                  {title}
                  {row + 1}
                </Drawer.Trigger>
                <Portal>
                <Drawer.Backdrop />
                <Drawer.Positioner padding="4">
                  <Drawer.Content rounded="md">
                    <Drawer.CloseTrigger />
                    <Drawer.Header>
                      <Drawer.Title>
                        {title}{row+1}
                      </Drawer.Title>
                    </Drawer.Header>
                    <Drawer.Body>
                      <p>
                        Video Title:
                      </p>
                      <p>
                        Editor:
                      </p>
                      <p>
                        Song:
                      </p>
                      <p>
                        Video Used:
                      </p>
                    </Drawer.Body>
                    <Drawer.Footer />
                  </Drawer.Content>
                </Drawer.Positioner>
                </Portal>
              </Drawer.Root>
            </RadioCard.Label>
            {Array.from({ length: 5 }, (_, col) => (
              <RadioCard.Item
                key={`${title}-${row + 1}-${col + 1}`}
                value={col + 1}
                className={`${title}-${row + 1}-${col + 1}`}
              >
                <RadioCard.ItemHiddenInput />
                <RadioCard.ItemControl>
                  <RadioCard.ItemText>{col + 1}</RadioCard.ItemText>
                </RadioCard.ItemControl>
              </RadioCard.Item>
            ))}
          </HStack>
        </RadioCard.Root>
      ))}
    </Stack>
  );
};
