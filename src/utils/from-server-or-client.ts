export default function fromServerOrClient<
  T1,
  T2 extends () => Promise<T1> = () => Promise<T1>,
>(onServer: T2, onClient: T2) {
  if (typeof process === 'undefined') {
    return onClient();
  }
  return onServer();
}
