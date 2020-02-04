/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import api from '../../services/api';

import Container from '../../components/Container';
import { Loading, Owner, IssueList } from './styles';

function Repository({ match }) {
  const repoURI = decodeURIComponent(match.params.repository);

  const [loading, setLoading] = useState(true);
  const [repo, setRepo] = useState({});
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    (async () => {
      const [repoRes, issuesRes] = await Promise.all([
        api.get(`/repos/${repoURI}`),
        api.get(`/repos/${repoURI}/issues`, {
          params: {
            state: 'open',
            per_page: 5,
          },
        }),
      ]);

      setRepo(repoRes.data);
      setIssues(issuesRes.data);
      console.log(repoRes.data);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return <Loading>Loading</Loading>;
  }

  return (
    <Container>
      <Owner>
        <Link to="/">Go Back</Link>
        <img src={repo.owner.avatar_url} alt={repo.owner.login} />

        <h1>{repo.name}</h1>
        <p>{repo.description}</p>
      </Owner>

      <IssueList>
        {issues.map(issue => (
          <li key={String(issue.id)}>
            <img src={issue.user.avatar_url} alt={issue.user.login} />
            <div>
              <strong>
                <a href={issue.html_url} target="blank">
                  {issue.title}
                </a>
                {issue.labels.map(label => (
                  <span key={String(label.id)}>{label.name}</span>
                ))}
              </strong>
              <p>{issue.user.login}</p>
            </div>
          </li>
        ))}
      </IssueList>
    </Container>
  );
}

export default Repository;
