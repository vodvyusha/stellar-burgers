import { IngredientDetailsUI } from '@ui';
import { useParams } from 'react-router-dom';

import { selectIngredients } from '@services/selectors';
import { useSelector } from '@services/store';

export const IngredientDetails = (): React.JSX.Element => {
  const { id } = useParams();

  const ingredientData = useSelector(selectIngredients).find(
    (ingredient) => ingredient._id === id
  );

  if (!ingredientData) {
    return <p className="text text_type_main-medium">Ингредиент не найден</p>;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
