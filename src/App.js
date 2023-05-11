import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

const schema = z
  .object({
    oldPass: z
      .string()
      .regex(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$|^$/,
        "не правильно ты дядя федор пароли ввдодишь"
      )
      .optional(),
    newPass: z
      .string()
      .regex(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$|^$/,
        "не правильно ты дядя федор пароли ввдодишь"
      )
      .optional(),
    reNewPass: z
      .string()
      .regex(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$|^$/,
        "не правильно ты дядя федор пароли ввдодишь"
      )
      .optional(),
    acceptNotifications: z.literal(true, {
      errorMap: () => ({ message: "Вы обязаны согласиться на все подписки" })
    }),
    profesion: z.string(),
    role: z.string()
  })
  .refine(
    (data) => {
      const amountOfEmptyFields = [
        data.newPass,
        data.oldPass,
        data.reNewPass
      ].filter((el) => el === "").length;
      return amountOfEmptyFields === 3 || amountOfEmptyFields === 0;
    },
    {
      path: ["oldPass"],
      message: "пароль не должен быть пустым если введен один из паролей"
    }
  )
  .refine(
    (data) => {
      const amountOfEmptyFields = [
        data.newPass,
        data.oldPass,
        data.reNewPass
      ].filter((el) => el === "").length;
      return amountOfEmptyFields === 3 || amountOfEmptyFields === 0;
    },
    {
      path: ["newPass"],
      message: "пароль не должен быть пустым если введен один из паролей"
    }
  )
  .refine(
    (data) => {
      const amountOfEmptyFields = [
        data.newPass,
        data.oldPass,
        data.reNewPass
      ].filter((el) => el === "").length;
      return amountOfEmptyFields === 3 || amountOfEmptyFields === 0;
    },
    {
      path: ["reNewPass"],
      message: "пароль не должен быть пустым если введен один из паролей"
    }
  )
  .refine(
    (data) => {
      if (![data.newPass, data.reNewPass].includes("")) {
        return data.newPass === data.reNewPass;
      }

      return true;
    },
    {
      path: ["reNewPass"],
      message: "пароли не совпадают"
    }
  )
  .refine(
    (data) => {
      if (![data.newPass, data.oldPass, data.reNewPass].includes("")) {
        return data.newPass === data.reNewPass;
      }

      return true;
    },
    { path: ["newPass"], message: "пароли не совпадают" }
  )
  .refine((data) => !(data.role === "сми" && data.profesion === "менеджер"), {
    path: ["profesion"],
    message: "сми не может быть менеджером"
  })
  .refine((data) => !(data.role === "сми" && data.profesion === "менеджер"), {
    path: ["role"],
    message: "сми не может быть менеджером"
  });

export default function App() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(schema)
  });

  const onSubmit = handleSubmit((data) => {
    console.log(data);
  });

  return (
    <form
      onSubmit={onSubmit}
      style={{ display: "flex", flexDirection: "column" }}
    >
      <label htmlFor="oldPass">Старый пароль</label>
      <input id="oldPass" {...register("oldPass")}></input>
      <span>{errors?.oldPass?.message}</span>

      <label htmlFor="newPass">Новый пароль</label>
      <input id="newPass" {...register("newPass")}></input>
      <span>{errors?.newPass?.message}</span>

      <label htmlFor="reNewPass">Повторите пароль</label>
      <input id="reNewPass" {...register("reNewPass")}></input>
      <span>{errors?.reNewPass?.message}</span>

      <label htmlFor="acceptNotifications">Согласен на все подписки*</label>
      <input
        id="acceptNotifications"
        type="checkbox"
        {...register("acceptNotifications")}
      ></input>
      <span>{errors?.acceptNotifications?.message}</span>

      <label htmlFor="role">Роль на платформе</label>
      <select id="role" {...register("role")}>
        <option value="участник">участник</option>
        <option value="выступающий">выступающий</option>
        <option value="сми">сми</option>
      </select>
      <span>{errors?.role?.message}</span>

      <select id="profesion" {...register("profesion")}>
        <option value="дизайнер">дизайнер</option>
        <option value="счетовод">счетовод</option>
        <option value="менеджер">менеджер</option>
      </select>
      <span>{errors?.profesion?.message}</span>

      <button type="submit">отправь меня</button>
    </form>
  );
}
