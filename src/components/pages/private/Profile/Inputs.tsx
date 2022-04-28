import React, {useEffect} from 'react';
import {Layout, Text, Toggle, Input} from '@ui-kitten/components';
import {TForm} from './Profile';
import {Live} from '../../../../apollo/graphql/queries/live';

type Props = {
  form: TForm;
  setForm: React.Dispatch<React.SetStateAction<TForm>>;
  setShowSave: React.Dispatch<React.SetStateAction<boolean>>;
  data: Live | null;
};

const Inputs: React.FC<Props> = ({form, setForm, setShowSave, data}) => {
  const onChangeOnline = (online: boolean) => setForm({...form, online});
  const onChangeName = (name: string) => setForm({...form, name});
  const onChangePosition = (position: string) => setForm({...form, position});

  useEffect(() => {
    if (deepEqual({...data?.live}, form)) setShowSave(false);
    else setShowSave(true);
  }, [data, form]);

  const deepEqual = (obj1: TForm, obj2: TForm): boolean =>
    JSON.stringify(obj1) === JSON.stringify(obj2);

  return (
    <Layout style={{flex: 1, padding: 20}}>
      <Layout
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text>Оффлайн/Онлайн</Text>
        <Toggle checked={form.online} onChange={onChangeOnline} />
      </Layout>
      <Input
        size="large"
        label="Имя"
        style={{marginTop: 20}}
        status="primary"
        value={form.name}
        onChangeText={onChangeName}
      />
      <Input
        size="large"
        label="Должность"
        style={{marginTop: 10}}
        status="primary"
        value={form.position}
        onChangeText={onChangePosition}
      />
    </Layout>
  );
};

export default Inputs;
