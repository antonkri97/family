import type { Gender } from "@prisma/client";
import { Form } from "@remix-run/react";
import React, { useEffect, useState } from "react";
import {
  FormBlock,
  AvatarUpload,
  BirthdayInput,
  Select,
  Button,
  Input,
} from "~/modules/shared";
import { Autocomplete } from "~/modules/shared/Autocomplete";
import { useSpouses } from "~/modules/shared/hooks";
import type { EntityLoaderReturnType } from "~/modules/shared/loaders";
import type { SimplePersonValidated } from "~/validators/person";
import { FindRelatives } from "./FindRelatives";
import { formatName } from "~/utils";

type PersonPageProps = {
  payload: { person?: SimplePersonValidated } & EntityLoaderReturnType;
};

export const PersonPage: React.FC<PersonPageProps> = ({ payload }) => {
  const { fathers, genders, mothers, persons, person } = payload;
  console.log(person);
  const [spouses, onGenderChange] = useSpouses(
    person?.gender ?? genders[0].value,
    persons
  );
  const [showRelationBlock, setShowRelationBlock] = useState(false);

  useEffect(() => {
    setShowRelationBlock(true);
  }, []);

  return (
    <Form
      method="post"
      className="grid grid-cols-2 gap-4 rounded-lg bg-white p-4 shadow-lg"
      encType="multipart/form-data"
    >
      <FormBlock title="Личная информация">
        <div className="grid place-content-center">
          <AvatarUpload
            name="avatar"
            label="Фото"
            url={person?.avatar ? `/${person?.avatar}` : ""}
          />
        </div>
        <div className="mb-4 grid grid-cols-3 gap-4">
          <Input
            defaultValue={person?.firstName}
            label="Имя: "
            name="firstName"
            dataTestId="first-name"
          />
          <Input
            defaultValue={person?.secondName}
            label="Фамилия: "
            name="secondName"
            dataTestId="second-name"
          />
          <Input
            defaultValue={person?.thirdName}
            label="Отчество: "
            name="thirdName"
            dataTestId="third-name"
          />
        </div>
        {/* Birthday control */}
        <BirthdayInput
          defaultValue={person?.birthday ?? ""}
          label="Год рождения: "
          name="birthday"
          dataTestId="birthday"
        />
        {/* Gender select control */}
        <Select
          defaultValue={person?.gender}
          label="Пол: "
          dataTestId="gender"
          onChange={(e) => {
            const value = e.target.value as Gender;
            onGenderChange(value);
            setShowRelationBlock(!!value);
          }}
          name="gender"
          addEmpty={false}
        >
          {genders.map((gender) => (
            <option key={gender.value} value={gender.value}>
              {gender.label}
            </option>
          ))}
        </Select>

        <div className="grid place-content-center">
          <Button type="submit" variant="primary" label="Добавить" />
        </div>
      </FormBlock>

      <FormBlock disabled={!showRelationBlock} title="Отношения">
        <FindRelatives
          label="Супруга"
          options={spouses.map((spouse) => ({
            value: spouse.id,
            label: formatName(spouse),
          }))}
        />

        <Select
          disabled={!showRelationBlock}
          label="Супруг(а): "
          name="spouse"
          dataTestId="spouse"
          defaultValue={person?.spouseId}
        >
          {spouses.map((spouse) => (
            <option key={spouse.id} value={spouse.id}>
              {`${spouse.secondName} ${spouse.firstName} ${spouse.thirdName}`}
            </option>
          ))}
        </Select>

        <Select
          disabled={!showRelationBlock}
          label="Мать"
          name="mother"
          dataTestId="mother"
          defaultValue={person?.motherId}
        >
          {mothers.map((mother) => (
            <option key={mother.id} value={mother.id}>
              {`${mother.secondName} ${mother.firstName} ${mother.thirdName}`}
            </option>
          ))}
        </Select>

        <Select
          disabled={!showRelationBlock}
          label="Отец"
          name="father"
          dataTestId="father"
          defaultValue={person?.fatherId}
        >
          {fathers.map((father) => (
            <option key={father.id} value={father.id}>
              {`${father.secondName} ${father.firstName} ${father.thirdName}`}
            </option>
          ))}
        </Select>
      </FormBlock>
    </Form>
  );
};
