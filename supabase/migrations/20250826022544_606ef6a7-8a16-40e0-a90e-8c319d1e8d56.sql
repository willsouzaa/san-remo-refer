-- Adicionar política de DELETE para referrals
-- Usuários podem excluir suas próprias indicações se estiverem pendentes ou em análise
CREATE POLICY "referrals_delete_own_pending" 
ON public.referrals 
FOR DELETE 
USING (
  ((user_id = auth.uid()) AND (status = ANY (ARRAY['pendente'::text, 'em_analise'::text]))) 
  OR is_staff()
);