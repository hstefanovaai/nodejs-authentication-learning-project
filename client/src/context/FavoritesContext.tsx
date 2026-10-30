import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import type { Book } from "../data/books";

interface FavoritesContextType {
  favorites: Book[];
  addFavorite: (book: Book) => void;
  removeFavorite: (bookId: number) => void;
  isFavorite: (bookId: number) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined,
);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Book[]>([]);

  function addFavorite(book: Book) {
    setFavorites((prev) => {
      if (prev.some((b) => b.id === book.id)) return prev;
      return [...prev, book];
    });
  }

  function removeFavorite(bookId: number) {
    setFavorites((prev) => prev.filter((b) => b.id !== bookId));
  }

  function isFavorite(bookId: number) {
    return favorites.some((b) => b.id === bookId);
  }

  return (
    <FavoritesContext.Provider
      value={{ favorites, addFavorite, removeFavorite, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used inside FavoritesProvider");
  }
  return context;
}
