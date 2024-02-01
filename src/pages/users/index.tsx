import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from 'react-query';

const UsersPage = () => {
  const queryClient = useQueryClient();

  const { data: users, isLoading, isError } = useQuery('users', async () => {
    const response = await fetch('/api/users');
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    return response.json();
  });

  const deleteUserMutation = useMutation(
    (id: number) => fetch(`/api/users/${id}`, { method: 'DELETE' }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users');
      },
    }
  );

  const handleDeleteUser = async (id: number) => {
    await deleteUserMutation.mutateAsync(id);
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-4">
      <h1 className="text-3xl font-bold mb-8">User Management</h1>
      <Link href="/users/new">
        <div className="bg-blue-500 text-white py-2 px-4 rounded mb-4 inline-block">
          Add User
        </div>
      </Link>
      {isLoading && <div>Loading...</div>}
      {isError && <div>Error fetching users</div>}
      {users && (
        <ul>
          {users.map((user:any) => (
            <li key={user.id} className="mb-2">
              {user.name} - {user.email}
              <Link href={`/users/${user.id}`}>
                <div className="ml-2 text-blue-500">Edit</div>
              </Link>
              <button
                onClick={() => handleDeleteUser(user.id)}
                className="ml-2 text-red-500"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UsersPage;
