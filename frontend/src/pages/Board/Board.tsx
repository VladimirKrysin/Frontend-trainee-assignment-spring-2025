import React from 'react';
import { useParams } from 'react-router';

interface BoardProps {
  projectId?: string;
}

export const Board: React.FC<BoardProps> = () => {
  const { id } = useParams();
  return <h1>Project Board {id}</h1>;
};
