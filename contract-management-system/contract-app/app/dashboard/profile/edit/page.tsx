'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import 'bulma/css/bulma.min.css';

export async function getWorkflows(workflowID: number) {
  // FormData to handle file upload
  const formData = new FormData();
  formData.append('userID', workflowID.toString());

  // Fetch API to send the request to your API route
  const response = await fetch('/api/get-account', {
    method: 'POST',
    body: formData,
  });

  // Handle response from the server
  if (response.ok) {
    return await response.json()
  } else {
    console.log(response.status)
  }
}

export default function workflowsPage() {
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [workflows, setWorkflows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tempWorkflowInfo = await getWorkflows(-1);
        setWorkflows(tempWorkflowInfo['data']);
        console.log(tempWorkflowInfo);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredWorkflows = query
    ? workflows.filter(
      (workflow: any) =>
        workflow.firstName.toLowerCase().includes(query.toLowerCase()) ||
        workflow.accountType.toString().includes(query.toLowerCase())
    )
    : workflows;

  const router = useRouter();
  const handleRowClick = (workflowId: number) => {
    router.push(`/dashboard/profile/edit/${workflowId}`);
  };

  return (
    <div>
      {loading ? (
        <p> Loading... </p>
      ) : (
        <div>
          <div className='mb-5'>
            <h1 className="title">Edit Account</h1>
            <h2 className="subtitle">
              Select an account that you would like to edit or remove
            </h2>
          </div>
          <div className='workflows'>
            <div className="field">
              <p className="control has-icons-left">
                {<input
                  className="input"
                  type="text"
                  placeholder="Search by title or creator..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />}
                <span className="icon is-small is-left">
                  <i className="fas fa-search"></i>
                </span>
              </p>
            </div>
            <table className="table is-striped is-fullwidth">
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Account Type</th>
                </tr>
              </thead>
              <tbody>
              {filteredWorkflows && filteredWorkflows.length > 0 ? (
                filteredWorkflows.map((workflow: any) => (
                  <tr key={workflow.userID} onClick={() => handleRowClick(workflow.userID)} style={{ cursor: 'pointer' }}>
                    <td> {workflow.firstName} </td>
                    <td> {workflow.lastName} </td>
                    <td> {workflow.email} </td>
                    <td> {workflow.accountType} </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4}>No People found</td>
                </tr>
              )}
            </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
