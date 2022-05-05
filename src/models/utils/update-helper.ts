import { Password } from '../../services/Password.service';
export const UpdateHelper = async (data: any) => {

    if (data.password) {
        data.password = await Password.toHash(data.password);
    }

    const keys = Object.keys(data)
        .filter((k) => {
            return data[k] !== undefined;
        });

    const names = keys.map((k, index) => {
        return k + ' = $' + (index + 1);
    }).join(', ');

    const values = keys.map((k) => {
        return data[k];
    });
    
    return {
        query: names,
        keys: keys,
        values: values
    };
};