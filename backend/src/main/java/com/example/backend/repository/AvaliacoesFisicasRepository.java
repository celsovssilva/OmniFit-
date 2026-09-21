package com.example.backend.repository;

import com.example.backend.entity.AvaliacoesFisicas;
import com.example.backend.entity.Treinos;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AvaliacoesFisicasRepository extends JpaRepository<AvaliacoesFisicas,Long> {
    List<AvaliacoesFisicas> findByAlunoId_IdOrderByDataDesc(Long alunoId);
    List<AvaliacoesFisicas> findByAlunoIdId(Long alunoId);
}
