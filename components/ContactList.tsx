import type { Contact } from '@/types/database'
import ContactCard from './ContactCard'
import styles from './ContactList.module.css'

interface Props {
  contacts: Contact[]
}

export default function ContactList({ contacts }: Props) {
  if (contacts.length === 0) {
    return <p className={styles.empty}>No contacts yet. <a href="/contacts/new">Add one</a>.</p>
  }

  return (
    <ul className={styles.list}>
      {contacts.map((contact) => (
        <li key={contact.id}>
          <ContactCard contact={contact} />
        </li>
      ))}
    </ul>
  )
}
