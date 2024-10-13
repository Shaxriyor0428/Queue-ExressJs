import { Router } from "express";
const mainIndexRouter = Router();
import clientRouter from "./client.routes.js";
import adminRouter from "./admin.routes.js";
import specialistRouter from "./specialist.routes.js";
import socialRouter from "./social.routes.js";
import otpRouter from "./otp.routes.js";
import tokenRouter from "./token.routes.js";
import serviceRouter from "./service.routes.js";
import queueRouter from "./queue.routes.js";
import spec_seviceRouter from "./spec_service.routes.js";
import spec_social from "./spec_social.routes.js";
import spec_working_day from "./spec_working_day.routes.js";


mainIndexRouter.use("/client", clientRouter);
mainIndexRouter.use("/admin", adminRouter);
mainIndexRouter.use("/specialist", specialistRouter);
mainIndexRouter.use("/social", socialRouter);
mainIndexRouter.use("/otp", otpRouter);
mainIndexRouter.use("/token", tokenRouter);
mainIndexRouter.use("/queue", queueRouter);
mainIndexRouter.use("/service", serviceRouter);
mainIndexRouter.use("/specservice", spec_seviceRouter);
mainIndexRouter.use("/specsocial", spec_social);
mainIndexRouter.use("/specworkingday", spec_working_day);
export default mainIndexRouter;
