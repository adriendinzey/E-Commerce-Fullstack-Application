import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'
import { Button, Form, FormControl, InputGroup } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

export default function SearchBox() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const submitHandler = (e: React.SyntheticEvent) => {
    e.preventDefault()
    navigate(query ? `/search?query=${query}` : '/search')
  }
  return (
    <Form className="flex-grow-1 d-flex me-auto" onSubmit={submitHandler}>
      <InputGroup>
        <FormControl
          type="text"
          name="q"
          id="q"
          placeholder="Search the Swale"
          aria-label="Search the Swale"
          aria-describedby="button-search"
          onChange={(e) => setQuery(e.target.value)}
        ></FormControl>
        <Button variant="outline-primary" type="submit" id="button-search">
          <FontAwesomeIcon icon={faSearch} />
        </Button>
      </InputGroup>
    </Form>
  )
}
