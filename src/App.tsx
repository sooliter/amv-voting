// import { animate, waapi } from 'animejs'
import { Accordion, HStack, RadioCard, Span, Stack } from '@chakra-ui/react'
// import { useEffect } from "react"

export default function App() {
  // list of categories and their counts
  const cats = [
    {title: "Action", count: 8},
    {title: "Drama", count: 8},
    {title: "Fun", count: 8},
    {title: "Love", count: 8},
    {title: "Comedy", count: 7},
  ]

  return (
      <GenerateCategories cats={cats} />
  )
}

// construct accordions for each category
// input = list of categories and their counts
const GenerateCategories = ({ cats }) => {
  return (
    <Accordion.Root multiple variant="subtle">
      {cats.map((cat, index) => (
        <Accordion.Item key={index} value={cat.title}>
          <Accordion.ItemTrigger>
            <Span flex="1">{cat.title}</Span>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
          <Accordion.ItemContent>
            <Accordion.ItemBody>
              <GenerateVoting title={cat.title[0]} count={cat.count} />
            </Accordion.ItemBody>
          </Accordion.ItemContent>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  )
}

// construct video radio cards for each video in the given category
// input = title of category, number of videos in that category
const GenerateVoting = ({ title, count }) => {
  return (
    <Stack>
      {Array.from({ length: count }, (_, row) => (
        <RadioCard.Root
          orientation="vertical"
          colorPalette="blue"
          key={`${title}-${row+1}`}
          align="center"
          justify="center"
          defaultValue="next"
        >
          <HStack>
            <RadioCard.Label minWidth="60px" fontSize="2em" color="blue">{title}{row+1}</RadioCard.Label>
            {Array.from({ length: 5 }, (_, col) => (
              <RadioCard.Item key={`${title}-${row+1}-${col+1}`} value={col+1}>
                <RadioCard.ItemHiddenInput />
                <RadioCard.ItemControl>
                  <RadioCard.ItemText>{col+1}</RadioCard.ItemText>
                </RadioCard.ItemControl>
              </RadioCard.Item>
            ))}
          </HStack>
        </RadioCard.Root>
      ))}
    </Stack>
  )
}
