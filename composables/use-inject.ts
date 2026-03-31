export default <T>(key: string, builder: new (data: any) => any) => {
    let model: Ref<T> | undefined = inject(key);
    if(model) model.value = new builder(model.value);
    return model;
}