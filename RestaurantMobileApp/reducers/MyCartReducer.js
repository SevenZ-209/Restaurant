const MyCartReducer = (currentState, action) => {
    switch (action.type) {
        case "add":
            if (currentState.find(item => item.id === action.payload.id))
                return currentState;

            return [...currentState, { ...action.payload, quantity: 1 }];

        case "remove":
            return currentState.filter(item => item.id !== action.payload);

        case "inc":
            return currentState.map(item => 
                item.id === action.payload 
                ? { ...item, quantity: item.quantity + 1 } 
                : item
            );

        case "dec":
            return currentState.map(item => {
                if (item.id === action.payload) {
                    return { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1 };
                }
                return item;
            });

        case "clear":
            return [];

        default:
            return currentState;
    }
}

export default MyCartReducer;