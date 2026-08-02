import { useState } from 'react'
import { HiChevronDown } from 'react-icons/hi2'
import './FaqAccordion.css'

export interface FaqItem {
  question: string
  answer: string
}

interface FaqAccordionProps {
  items: FaqItem[]
  groupLabel?: string
}

function FaqAccordion({ items, groupLabel }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="faq-group">
      {groupLabel && <h3 className="faq-group-label">{groupLabel}</h3>}
      <div className="faq-list">
        {items.map((item, index) => {
          const isOpen = openIndex === index
          return (
            <div key={item.question} className={`faq-item ${isOpen ? 'faq-item-open' : ''}`}>
              <button
                className="faq-question"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                aria-expanded={isOpen}
              >
                <span>{item.question}</span>
                <HiChevronDown className="faq-icon" />
              </button>
              <div className="faq-answer-wrap">
                <p className="faq-answer">{item.answer}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default FaqAccordion
