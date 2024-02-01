import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/router';
import { useMutation, useQueryClient } from 'react-query';

type FormData = {
  action?: string;
  name?: string;
  email: string;
  password: string;
};

const postData = async (url: string, formData: FormData) => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return response.json();
  } catch (error) {
    throw new Error(`Error: ${error}`);
  }
};

const fetchUserData = async (formData: FormData) => {
  const url = '/api/users';
  return postData(url, formData);
};

const fetchAuthData = async (formData: FormData) => {
  const url = '/api/auth';
  return postData(url, formData);
};

type ValidationMessageProps = {
  message: string;
  isError: boolean;
};

const ValidationMessage: React.FC<ValidationMessageProps> = ({
  message,
  isError,
}) => (
  <p
    className={`mt-4 ${isError ? 'text-red-500 bg-red-100' : 'text-green-500 bg-green-100'
      } p-2 rounded-md`}
  >
    {message}
  </p>
);

type AuthModalProps = {
  isOpen: boolean;
};

const AuthModal: React.FC<AuthModalProps> = ({ isOpen }) => {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [validationMessage, setValidationMessage] = useState<string>('');

  const queryClient = useQueryClient();
  const mutation = useMutation(
    (formData: FormData) =>
      isLogin ? fetchAuthData(formData) : fetchUserData(formData),
    {
      onSuccess: (data) => {
        const token = data.token;
        localStorage.setItem('token', token);
        router.push('/');
        setValidationMessage('Operação realizada com sucesso!');
        setTimeout(() => {
         router.reload();
        }, 3000);
      },
      onError: (error) => {
        console.error('Authentication error:', error);
        setValidationMessage(
          'Erro na autenticação. Verifique suas credenciais.'
        );
      },
      onSettled: () => {
        queryClient.invalidateQueries('users');
      },
    }
  );

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isLogin) {
      mutation.mutate({
        action: 'login',
        email,
        password,
      });
    } else {
      mutation.mutate({
        name,
        email,
        password,
      });
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="z-10 bg-white p-6 rounded-lg shadow-lg">
            <button
              className="absolute top-4 right-4 text-white"
              onClick={() => {
                router.reload();
              }}
            >
              X
            </button>
            <h2 className="text-2xl font-bold mb-4">
              {isLogin ? 'Login' : 'Registrar'}
            </h2>
            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="mb-4">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-600"
                  >
                    Nome
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={name}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setName(e.target.value)
                    }
                    required
                    className="mt-1 p-2 w-full border rounded-md"
                  />
                </div>
              )}
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-600"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setEmail(e.target.value)
                  }
                  required
                  className="mt-1 p-2 w-full border rounded-md"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-600"
                >
                  Senha
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setPassword(e.target.value)
                  }
                  required
                  className="mt-1 p-2 w-full border rounded-md"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white p-2 rounded-md"
              >
                {isLogin ? 'Entrar' : 'Registrar'}
              </button>
            </form>
            {validationMessage && (
              <ValidationMessage
                message={validationMessage}
                isError={mutation.isError}
              />
            )}
            <p className="mt-4">
              {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
              <button
                className="text-blue-500 ml-1 underline"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setValidationMessage('');
                }}
              >
                {isLogin ? 'Registrar aqui' : 'Entrar'}
              </button>
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default AuthModal;
