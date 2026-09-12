import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { StoreContext } from "./StoreContext";
import { getMyLibrary } from "../services/ownershipApi";
import useAuth from "./useAuth";

const WISHLIST_STORAGE_KEY = "novavault_wishlist";
const CART_STORAGE_KEY = "novavault_cart";

function StoreProvider({ children }) {

  const { isAuthenticated } = useAuth();

  // ============================================================
  // WISHLIST
  // ============================================================

  const [wishlist, setWishlist] = useState(() => {
    try {
      const savedWishlist = localStorage.getItem(
        WISHLIST_STORAGE_KEY
      );

      return savedWishlist
        ? JSON.parse(savedWishlist)
        : [];
    } catch {
      return [];
    }
  });

  // ============================================================
  // CART
  // ============================================================

  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem(
        CART_STORAGE_KEY
      );

      return savedCart
        ? JSON.parse(savedCart)
        : [];
    } catch {
      return [];
    }
  });

    // ============================================================
  // OWNERSHIP
  // ============================================================

  const [ownedGameIds, setOwnedGameIds] = useState([]);
  const [ownershipLoading, setOwnershipLoading] = useState(true);

  // ============================================================
  // PERSIST WISHLIST
  // ============================================================

  useEffect(() => {
    localStorage.setItem(
      WISHLIST_STORAGE_KEY,
      JSON.stringify(wishlist)
    );
  }, [wishlist]);

  // ============================================================
  // PERSIST CART
  // ============================================================

  useEffect(() => {
    localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify(cart)
    );
  }, [cart]);

    // ============================================================
  // LOAD OWNERSHIP
  // ============================================================

  useEffect(() => {
  let cancelled = false;

  const loadOwnership = async () => {
    if (!isAuthenticated) {
      setOwnedGameIds([]);

      if (!cancelled) {
        setOwnershipLoading(false);
      }

      return;
    }

    try {
      setOwnershipLoading(true);

      const data = await getMyLibrary();

      if (!cancelled) {
        const ids = (data.games || [])
          .map((game) => game._id || game.id)
          .filter(Boolean)
          .map((id) => id.toString());

        setOwnedGameIds(ids);
      }
    } catch {
      if (!cancelled) {
        setOwnedGameIds([]);
      }
    } finally {
      if (!cancelled) {
        setOwnershipLoading(false);
      }
    }
  };

  loadOwnership();

  return () => {
    cancelled = true;
  };
}, [isAuthenticated]);

  // ============================================================
  // WISHLIST ACTIONS
  // ============================================================

  const toggleWishlist = useCallback((game) => {
    setWishlist((currentWishlist) => {
      const alreadySaved = currentWishlist.some(
        (item) => item.id === game.id
      );

      if (alreadySaved) {
        return currentWishlist.filter(
          (item) => item.id !== game.id
        );
      }

      return [...currentWishlist, game];
    });
  }, []);

  const isWishlisted = useCallback(
    (gameId) => {
      return wishlist.some(
        (item) => item.id === gameId
      );
    },
    [wishlist]
  );

  const clearWishlist = useCallback(() => {
    setWishlist([]);
  }, []);

  // ============================================================
  // CART ACTIONS
  // ============================================================

  const addToCart = useCallback((game) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (item) => item.id === game.id
      );

      if (existingItem) {
        return currentCart.map((item) =>
          item.id === game.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...currentCart,
        {
          ...game,
          quantity: 1,
        },
      ];
    });
  }, []);

  const removeFromCart = useCallback((gameId) => {
    setCart((currentCart) =>
      currentCart.filter(
        (item) => item.id !== gameId
      )
    );
  }, []);

  const updateCartQuantity = useCallback(
    (gameId, quantity) => {
      setCart((currentCart) =>
        currentCart.map((item) =>
          item.id === gameId
            ? {
                ...item,
                quantity: Math.max(1, quantity),
              }
            : item
        )
      );
    },
    []
  );

  const isInCart = useCallback(
    (gameId) => {
      return cart.some(
        (item) => item.id === gameId
      );
    },
    [cart]
  );

    const isGameOwned = useCallback(
    (gameId) => {
      if (!gameId) {
        return false;
      }

      return ownedGameIds.includes(gameId.toString());
    },
    [ownedGameIds]
  );

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  // ============================================================
  // CONTEXT VALUE
  // ============================================================

  const value = useMemo(
    () => ({
      wishlist,
      wishlistCount: wishlist.length,

      toggleWishlist,
      isWishlisted,
      clearWishlist,

      cart,
      cartCount: cart.reduce(
        (total, item) => total + item.quantity,
        0
      ),

      addToCart,
      removeFromCart,
      updateCartQuantity,
      isInCart,
      clearCart,

      ownedGameIds,
      ownershipLoading,
      isGameOwned,
    }),
    [
      wishlist,
      toggleWishlist,
      isWishlisted,
      clearWishlist,

      cart,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      isInCart,
      clearCart,

      ownedGameIds,
      ownershipLoading,
      isGameOwned,
    ]
  );

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
}

export default StoreProvider;