import { create } from 'zustand';
import { TYPE_DAMAGE, TYPE_COUNT } from './TypeData.js';

const useTypeDamageStore = create((set, get) => ({
  // State
  srcTypeDamage: JSON.parse(JSON.stringify(TYPE_DAMAGE)),
  typeDamage: JSON.parse(JSON.stringify(TYPE_DAMAGE)),
  diffCount: 0,

  // Actions
  updateCell: (rowIndex, colIndex, newValue) => {
    const { srcTypeDamage, typeDamage } = get();
    
    set((state) => {
      const newDamage = state.typeDamage.map((row, idx) => 
        idx === rowIndex 
          ? { ...row, values: [...row.values] }
          : row
      );
      newDamage[rowIndex].values[colIndex] = newValue;

      const srcValue = srcTypeDamage[rowIndex].values[colIndex];
      const oldValue = typeDamage[rowIndex].values[colIndex];
      const wasChanged = srcValue !== oldValue ? 1 : 0;
      const isChanged = srcValue !== newValue ? 1 : 0;
      const newDiffCount = state.diffCount + (isChanged - wasChanged);

      return {
        typeDamage: newDamage,
        diffCount: newDiffCount
      };
    });
  },

  clearRow: (rowIndex) => {
    const { srcTypeDamage, typeDamage } = get();
    
    set((state) => {
      const newDamage = [...state.typeDamage];
      newDamage[rowIndex] = {
        ...newDamage[rowIndex],
        values: new Array(TYPE_COUNT).fill("")
      };

      let rowDiffCount = 0;
      for (let colIndex = 0; colIndex < TYPE_COUNT; colIndex++) {
        const srcValue = srcTypeDamage[rowIndex].values[colIndex];
        const oldValue = typeDamage[rowIndex].values[colIndex];
        const wasChanged = srcValue !== oldValue ? 1 : 0;
        const isChanged = srcValue !== "" ? 1 : 0;
        rowDiffCount += isChanged - wasChanged;
      }

      return {
        typeDamage: newDamage,
        diffCount: state.diffCount + rowDiffCount
      };
    });
  },

  clearColumn: (colIndex) => {
    const { srcTypeDamage, typeDamage } = get();
    
    set((state) => {
      const newDamage = state.typeDamage.map(row => ({
        ...row,
        values: row.values.map((val, idx) => idx === colIndex ? "" : val)
      }));

      let colDiffCount = 0;
      for (let rowIndex = 0; rowIndex < TYPE_COUNT; rowIndex++) {
        const srcValue = srcTypeDamage[rowIndex].values[colIndex];
        const oldValue = typeDamage[rowIndex].values[colIndex];
        const wasChanged = srcValue !== oldValue ? 1 : 0;
        const isChanged = srcValue !== "" ? 1 : 0;
        colDiffCount += isChanged - wasChanged;
      }

      return {
        typeDamage: newDamage,
        diffCount: state.diffCount + colDiffCount
      };
    });
  },

  clearAll: () => {
    set((state) => ({
      typeDamage: state.typeDamage.map(row => ({
        type: row.type,
        values: new Array(row.values.length).fill("")
      })),
      diffCount: 120
    }));
  },

  uploadChart: (content) => {
    const { srcTypeDamage, typeDamage } = get();
    
    const lines = content.split('\n').slice(2);
    const data = lines.map(line => line.split(','));

    const newDamage = typeDamage.map((row, rowIndex) => ({
      ...row,
      values: row.values.map((_, colIndex) => data[rowIndex]?.[colIndex] || "")
    }));

    let newDiffCount = 0;
    for (let rowIndex = 0; rowIndex < TYPE_COUNT; rowIndex++) {
      for (let colIndex = 0; colIndex < TYPE_COUNT; colIndex++) {
        const value = newDamage[rowIndex].values[colIndex];
        if (value !== srcTypeDamage[rowIndex].values[colIndex]) {
          newDiffCount++;
        }
      }
    }

    set({
      typeDamage: newDamage,
      diffCount: newDiffCount
    });
  }
}));

export default useTypeDamageStore;