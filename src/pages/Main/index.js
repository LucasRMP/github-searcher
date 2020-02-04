import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';

import api from '../../services/api';

import Container from '../../components/Container';

import { Form, SubmitButton, List } from './styles';

export default function Main() {
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');
  const [repos, setRepos] = useState([]);

  // Load from localStorage
  useEffect(() => {
    const reposStr = localStorage.getItem('repos');
    setRepos(JSON.parse(reposStr) || []);
  }, []);

  // Save in localStorage allways repos changes
  useEffect(() => {
    localStorage.setItem('repos', JSON.stringify(repos));
  }, [repos]);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await api.get(`/repos/${input}`);

      const newEl = {
        name: data.full_name,
      };

      setRepos([...repos, newEl]);
    } catch (err) {
      console.warn(err);
    }

    setLoading(false);
    setInput('');
  };

  return (
    <Container>
      <h1>
        <FaGithubAlt />
        Repositories
      </h1>

      <Form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          type="text"
          placeholder="Add repository"
        />

        <SubmitButton loading={loading.toString()}>
          {!loading ? (
            <FaPlus color="#fff" size={14} />
          ) : (
            <FaSpinner color="#fff" size={14} />
          )}
        </SubmitButton>
      </Form>

      <List>
        {repos.map(repo => (
          <li key={repo.name}>
            <span>{repo.name}</span>
            <Link to={`/repository/${encodeURIComponent(repo.name)}`}>
              Details
            </Link>
          </li>
        ))}
      </List>
    </Container>
  );
}
