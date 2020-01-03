export interface IMapper<S,T> {
    toTarget(source:S):T;
    toSource(target:T):S;
}